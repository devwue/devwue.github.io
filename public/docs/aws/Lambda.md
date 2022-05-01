# AWS - Lambda
Serverless 코드로만 동작 가능

* 실행권한
* 트리거
* 변수
  * 설정된 변수를 코드로 읽어 들일수 있음

#### 코드 샘플
SNS 트리거를 같이 걸 수 있음
```js
'use strict';
const AWS = require('aws-sdk');
const url = require('url');
const https = require('https');

// 설정된 환경 변수
const hookUrl = process.env.slackHookUrl;
let slackChannel = process.env.slackChannel;

// HTTP Post Request
function postMessage(message, callback) {
    const body = JSON.stringify(message);
    const options = url.parse(hookUrl);
    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
    };

    const postReq = https.request(options, (res) => {
        const chunks = [];
        res.setEncoding('utf8');
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
            if (callback) {
                callback({
                    body: chunks.join(''),
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                });
            }
        });
        return res;
    });

    postReq.write(body);
    postReq.end();
}

// CloudWatch Event 
function processEvent(message, callback) {
    console.info("CloudWatch Event");

    const alarmName = String(message.AlarmName);
    var alarmDescription = String(message.AlarmDescription);
    const reason = message.NewStateReason;
    
    const oldState = message.OldStateValue;
    const newState = message.NewStateValue;
    const changeTime = new Date(message.StateChangeTime).toLocaleString("ko-KR");

    if (oldState == "INSUFFICIENT_DATA" && newState == "OK") {
        return;
    }
    if (oldState == "OK" && newState == "INSUFFICIENT_DATA") {
        return;
    }

    var descriptions = alarmDescription.split(" ").map(x => x.trim());
    alarmDescription = "";
    for (var idx in descriptions) {
        if (descriptions[idx].indexOf("#") >= 0) {
            slackChannel = descriptions[idx].trim();
            continue;
        } else if(descriptions[idx].indexOf("(") >= 0 && descriptions[idx].indexOf(")") >= 0) {
            switch (descriptions[idx]) {
                case "(dev)":
                case "(qa)":
                case "(stage)":
                    return;
            }
        }
        alarmDescription = alarmDescription.concat(" ").concat(descriptions[idx]);
    }
    alarmDescription.trim();

    // 메시지
    var attachment = {
        title: alarmDescription,
		text: alarmName,
		color: "#36a64f",
		mrkdwn_in: ["fields"],
        fields: [
            {
                title: "상태",
                value: "`" + oldState + "` ⇒ `" + newState + "`",
                short: true
            },
            {
    			title: "일시",
                value: changeTime,
                short: true
    		},
    		{
    		    title: "상태사유",
                value: "```" + reason + "```",
                short: false
    		}
    	],
    	actions: [
            {
                text: "CloudWatch",
                type: "button",
				style:"danger",
                url: "https://ap-northeast-2.console.aws.amazon.com/cloudwatch/home?region=ap-northeast-2#alarm:alarmFilter=ANY;name=" + alarmName
            }
        ]
    };
    
    if (newState == "OK") {
        attachment.color = "#36a64f";       // 녹색
    } else if (newState == "ALARM") {
        attachment.color = "#cc0000";       // 빨간색
    } else {
        attachment.color = "#00AFFF";       // 파랑색
    }
    
    var slackMessage = {
        username: "AWS Alert",
        attachments: [],
        channel: slackChannel
    }
    
    
    // Beanstalk 정보
    if (alarmName.startsWith("awseb")) {
        var environmentId = message.AlarmName.split("-", 3).splice(1, 2).join("-");
        var environmentUrl = "https://ap-northeast-2.console.aws.amazon.com/elasticbeanstalk/home?region=ap-northeast-2#/environment/dashboard?environmentId=" + environmentId;
        
        var environment = findEnvironmentName(environmentId);
        
        environment.then(function (data) {
            if (data == null) {
                return ;
            }

            attachment.fields.splice(2, 0, 
                {
                    title: "환경",
                    value: "`" + environmentId + "`",
                    short: true
                }
            );
            
            attachment.fields.splice(3, 0, 
        		{
        		    title: "서비스명",
                    value: "`" + data.name + " (" + data.env + ")`",
                    short: true
        		}
            );
            
            attachment.actions.push(
                {
                    text: "Beanstalk",
                    type: "button",
    				style: "primary",
                    url: environmentUrl
                }
            );
            
            slackMessage.attachments.push(attachment);
            
            postMessage(slackMessage, (response) => {
                if (response.statusCode < 400) {
                    console.info('Message posted successfully');
                    callback(null);
                } else if (response.statusCode < 500) {
                    console.error(`Error posting message to Slack API: ${response.statusCode} - ${response.statusMessage}`);
                    callback(null);  // Don't retry because the error is due to a problem with the request
                } else {
                    // Let Lambda retry
                    callback(`Server error when processing message: ${response.statusCode} - ${response.statusMessage}`);
                }
            });
        });
        
    } else {
         slackMessage.attachments.push(attachment);
    
        postMessage(slackMessage, (response) => {
            if (response.statusCode < 400) {
                console.info('Message posted successfully');
                callback(null);
            } else if (response.statusCode < 500) {
                console.error(`Error posting message to Slack API: ${response.statusCode} - ${response.statusMessage}`);
                callback(null);  // Don't retry because the error is due to a problem with the request
            } else {
                // Let Lambda retry
                callback(`Server error when processing message: ${response.statusCode} - ${response.statusMessage}`);
            }
        });
    }
   
}

// AutoScaling Event 
function processAutoScalingEvent(message, callback) {
    console.info("AutoScaling Event");
    
    const eventName = message.detail.AutoScalingGroupName;      // awseb-e-jfhukqnib2-stack-AWSEBAutoScalingGroup-TVBYBCPN4NNZ
    const eventType = message["detail-type"];                   // EC2 Instance Launch Successful / EC2 Instance Terminate Successful
    const eventDescription = message.detail.Description;
    const eventCause = message.detail.Cause;
    
    const instanceId = message.detail.EC2InstanceId;                        // i-08562189ceb70e665
    const availabilityZone = message.detail.Details["Availability Zone"];
    const subnetId = message.detail.Details["Subnet ID"];                   // subnet-07ef9c4a
    const startTime = new Date(message.detail.StartTime).toLocaleString("ko-KR");
    const endTime = new Date(message.detail.EndTime).toLocaleString("ko-KR");
    
    // 메시지
    var attachment = {
        title: eventType,
		text: eventDescription,
		color: "#36a64f",
		mrkdwn_in: ["fields"],
        fields: [
            {
    			title: "Scaling Reason",
                value: "```" + minimizeCause(eventCause) + "```",
                short: false
    		}
    		
    	],
    	actions: [
            
        ]
    };
    
    let triggerName;
    switch (eventType) {
        case "EC2 Instance Launch Successful":
            attachment.color = "#36a64f"; // green
            break;
        case "EC2 Instance Terminate Successful":
            attachment.color = "#00AFFF"; // blue
            break;
        default:
            attachment.color = "#cc0000"; //red
    }
    
    var slackMessage = {
        username: "AutoScaling Event",
        attachments: [],
        channel: slackChannel
    }
    
    // Beanstalk 정보
    if (eventName.startsWith("awseb")) {
        var environmentId = eventName.split("-", 3).splice(1, 2).join("-");
        var environmentUrl = "https://ap-northeast-2.console.aws.amazon.com/elasticbeanstalk/home?region=ap-northeast-2#/environment/dashboard?environmentId=" + environmentId;
        
        var environment = findEnvironmentName(environmentId);
        
        environment.then(function (data) {
            
            if (data == null) {
                return ;
            }

            attachment.fields.splice(0, 0, 
        		{
        		    title: "서비스명",
                    value: "`" + data.name + " (" + data.env + ")`",
                    // short: true
        		}
            );
            
            attachment.actions.push(
                {
                    text: "Beanstalk",
                    type: "button",
        			style: "primary",
                    url: environmentUrl
                }
            );
            
            slackMessage.attachments.push(attachment);
            
            postMessage(slackMessage, (response) => {
                if (response.statusCode < 400) {
                    console.info('Message posted successfully');
                    callback(null);
                } else if (response.statusCode < 500) {
                    console.error(`Error posting message to Slack API: ${response.statusCode} - ${response.statusMessage}`);
                    callback(null);  // Don't retry because the error is due to a problem with the request
                } else {
                    // Let Lambda retry
                    callback(`Server error when processing message: ${response.statusCode} - ${response.statusMessage}`);
                }
            });
        });
    }
}

// Beanstalk Search
function findEnvironmentName(environmentId) {
    var resourcegroupstaggingapi = new AWS.ResourceGroupsTaggingAPI({apiVersion: '2022-04-26'});
    var params = {
        ResourceTypeFilters: [
            'ec2:instance'
        ],
        TagFilters: [
            {
                Key: 'AnyTagName',
                Values: [
                    'test'
                ]
            },
            {
                Key: 'elasticbeanstalk:environment-id',
                Values: [
                    environmentId
                ]
            }
        ],
        TagsPerPage: 100
    };
    
    return new Promise(function (resolve, reject) {
        resourcegroupstaggingapi.getResources(params, function (err, data) {
            if (err) {
                console.log(err, err.stack);
                resolve(null);
                return;
            }
            
            console.info(data.ResourceTagMappingList);
            
            if (data.ResourceTagMappingList.length <= 0) {
                resolve(null);
                return;
            }
            
            var tags = data.ResourceTagMappingList[0].Tags;
            
            function getValueByKey(key) {
                return tags.filter(
                    function(tags){ return tags.Key == key }
                );
            }
            
            var data = {
                name: getValueByKey('Service')[0].Value,
                env: getValueByKey('Environment')[0].Value
            };
            resolve(data);
        })
    });
}


function minimizeCause(cause) {
    cause = String(cause)
    console.info(cause);
    if (/changing.*?from\s\d*\sto\s\d*/g.exec(cause) != null) {
        return "···" + /changing.*?from\s\d*\sto\s\d*/g.exec(cause) + "···";
    }
    if (/increasing.*?from\s\d\sto\s\d/g.exec(cause) != null) {
        return "···" + /increasing.*?from\s\d*\sto\s\d*/g.exec(cause) + "···";
    }
    if (/shrinking.*?from\s\d\sto\s\d/g.exec(cause) != null) {
        return "···" + /shrinking.*?from\s\d*\sto\s\d*/g.exec(cause) + "···";
    }
    return cause;    
}

// event handler
exports.handler = (event, context, callback) => {
    const message = JSON.parse(event.Records[0].Sns.Message);
    
    // event from CloudWatch
    if (message.hasOwnProperty('AlarmName')){
        processEvent(message, callback);
    }
    
    // event from AutoScaling
    if (message.hasOwnProperty('source') && String(message.source).startsWith("aws.autoscaling") ){
        processAutoScalingEvent(message, callback);
    }
    
};
```