
# For Domain (Route 53)
AWS = require("aws-sdk")
_ = require("lodash")
async = require("async")
uuid = require("uuid")

# config = require './config'

# Based on https://github.com/christophercliff/caisson
# -------------------------------------------------------------

HOSTED_ZONE_ID_RE = /^\/hostedzone\//
S3_HOSTED_ZONE_IDS =
  # Listed here: http://docs.aws.amazon.com/general/latest/gr/rande.html#s3_region
  "us-east-1": "Z3AQBSTGFYJSTF"
  "us-west-1": "Z2F56UZL2M1ACD"
  "us-west-2": "Z3BJ6K6RIION7M"
  "eu-west-1": "Z1BKCTXD74EZPE"
  "ap-southeast-1": "Z3O0J2DXBE1FTB"
  "ap-southeast-2": "Z1WCIGYICN2BYD"
  "ap-northeast-1": "Z2M4EHUR26P7ZW"
  "sa-east-1": "Z7KQH4QJS55SO"

createHostedZoneParams = (domain) ->
  Name: domain
  CallerReference: uuid.v1()

changeResourceRecordSetsParams = (domain, hostedZoneId, region) ->
  HostedZoneId: hostedZoneId
  ChangeBatch:
    Changes: [
      {
        Action: "CREATE"
        ResourceRecordSet:
          Name: domain + "."
          Type: "A"
          AliasTarget:
            HostedZoneId: S3_HOSTED_ZONE_IDS[region]
            DNSName: "s3-website-" + region + ".amazonaws.com."
            EvaluateTargetHealth: false
      }
      {
        Action: "CREATE"
        ResourceRecordSet:
          Name: "www." + domain + "."
          Type: "CNAME"
          TTL: 300
          ResourceRecords: [Value: "www." + domain + ".s3-website-" + region + ".amazonaws.com"]
      }
    ]

parseHostedZoneId = (res) ->
  res.HostedZone.Id.replace HOSTED_ZONE_ID_RE, ""

createHostedZone = (options, callback) ->
  route53 = options.route53
  domain = options.domain
  region = options.region
  route53.listHostedZones (err, res) ->
    hostedZone = undefined
    hostedZoneId = undefined
    return callback(new Error(err))  if err
    hostedZone = _.findWhere(res.HostedZones,
      Name: domain + "."
    )
    if hostedZone
      return route53.getHostedZone(
        Id: hostedZone.Id
      , callback)
    async.waterfall [
      async.apply(route53.createHostedZone.bind(route53), createHostedZoneParams(domain))
      (res, c) ->
        hostedZoneId = parseHostedZoneId(res)
        route53.changeResourceRecordSets changeResourceRecordSetsParams(domain, parseHostedZoneId(res), region), c
    ], (err, res) ->
      return callback(new Error(err))  if err
      route53.getHostedZone
        Id: hostedZoneId
      , callback

exports.createHostedZoneParams = createHostedZoneParams
exports.changeResourceRecordSetsParams = changeResourceRecordSetsParams
exports.createHostedZone = createHostedZone


# For Actually putt the bucket policy (and files?) to s3.
# ****************************************************


s3_client = ''
policy = ''

exports.config =  (aws_config) ->
  # switch to the proper names
  aws_config =
    accessKeyId: aws_config.key
    secretAccessKey: aws_config.secret
    region:  aws_config.region
    bucket: aws_config.bucket

  AWS.config.update aws_config

  s3_client = new AWS.S3
    params:
      Bucket: aws_config.bucket

  policy = {
    "Version": "2008-10-17",
    "Statement": [{
      "Sid": "AllowPublicRead",
      "Effect": "Allow",
      "Principal": { "AWS": "*" },
      "Action": ["s3:GetObject"],
      "Resource": ["arn:aws:s3:::#{aws_config.bucket}/*" ]
    }]
  }


exports.createBucket = (cb)->
  # console.log s3_client
  s3_client.createBucket (err)->
    console.log err if err
    console.log 'Bucket created'
    cb()

exports.putBucketPolicy = (cb)->
  console.log 'putting bucket policy'
  s3_client.putBucketPolicy  {Policy : JSON.stringify policy}, (err, d)->
    # console.log d
    console.log err if err
    console.log 'done putting bucket policy'
    cb()

# like, put a normal file
exports.putObject = (data = {Key: 'index.html', Body: '<html>boo!</html>'}) ->
  # data = {Key: 'index.html', Body: 'boo!'}
  s3_client.putObject data, (err, d) ->
    console.log err if err
    console.log 'obj uploaded'

exports.configureWebsite = (bucket)->
  s3_client.getBucketWebsite {Bucket: bucket}, (err) ->
      console.log "Enabling website configuration on " + bucket + "..."
      webOptions = {IndexDocument:Suffix: "index.html"}
      s3_client.putBucketWebsite
        Bucket: bucket
        WebsiteConfiguration: webOptions
        # TODO could use this here for www. redirect I think
        # WebsiteRedirectLocation: ""
      , (e,d)->
          console.log e if e
          # console.log  s3_client
  # else
    # console.log 'getBucketWebsite err:'
    # console.log err

# works!, not concurrently though?
# domain
exports.createDns = (domain)->
  route53 = new AWS.Route53()
  dns_options =
    route53: route53
    domain: domain
  dns.create dns_options, (e, z)-> console.log e; console.log z



