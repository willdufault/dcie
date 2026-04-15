export const handler = async (event, context) => {
    
    console.log(event);
    
    const executionId = event.executionId;
    const incrementalExportWindowSizeInHours = event.incrementalExportWindowSizeInHours;
    const lastExportTime = new Date(event.lastExportTime);
    const resultDate = new Date(lastExportTime.getTime() + (incrementalExportWindowSizeInHours * 3600000));

    const currentDateTime = new Date();
    const timeDiffFromLastExportToNow = currentDateTime - lastExportTime;
    const timeDiffFromLastExportToNowInMinutes = timeDiffFromLastExportToNow / (1000 * 60);
    const timeDiffFromLastExportToNowInMinutesInBlocks = timeDiffFromLastExportToNowInMinutes/(incrementalExportWindowSizeInHours * 60);
    const incrementalBlocksBehind = Math.floor(timeDiffFromLastExportToNowInMinutesInBlocks) - 1; // the current window is always discarded

    console.log(`Id:${executionId} - Current time:${currentDateTime}`);
    console.log(`Id:${executionId} - Time Diff:${timeDiffFromLastExportToNow}`);
    console.log(`Id:${executionId} - Time Diff in Mins:${timeDiffFromLastExportToNowInMinutes}`);
    console.log(`Id:${executionId} - Time Diff in Mins in blocks:${timeDiffFromLastExportToNowInMinutesInBlocks}`);
    console.log(`Id:${executionId} - Incremental blocks behind:${incrementalBlocksBehind}`);

    const tableArn = event.tableArn;
    const bucket = event.bucket;
    const bucketPrefix = event.bucketPrefix;
    const exportFormat = event.exportFormat;
    const exportViewType = event.exportViewType;
    const sseKmsKeyArn = event.sseKmsKeyArn;

    let prefixCmd = '';
    if (bucketPrefix !== '')
    {
        prefixCmd = ` --s3-prefix ${bucketPrefix}`;
    }

    let sseCmd = '';
    if (sseKmsKeyArn) {
        sseCmd = ` --s3-sse-algorithm KMS --s3-sse-kms-key-id ${sseKmsKeyArn}`;
    }

    const remedy = `aws dynamodb export-table-to-point-in-time --table-arn ${tableArn} --s3-bucket ${bucket}${prefixCmd}${sseCmd} --export-format ${exportFormat} --export-type INCREMENTAL_EXPORT --incremental-export-specification ExportFromTime=${Math.floor(lastExportTime/1000)},ExportToTime=${Math.floor(resultDate/1000)},ExportViewType=${exportViewType}`;

    const response = {
        statusCode: 200,
        body: {
            "lastExportTime": lastExportTime,
            "incrementalExportWindowSizeInHours": incrementalExportWindowSizeInHours,
            "durationAddedStartTime": resultDate,
            "incrementalBlocksBehind": incrementalBlocksBehind,
            "remedy": remedy
        }
    };

    return response;
};
