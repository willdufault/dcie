import { Construct } from 'constructs';
import { IncrementalExportDefaults } from './constants/incrementalExportDefaults';
import { ExportViewType } from './constants/exportViewType';
import { ExportFormat } from './constants/exportFormat';
import { ScheduleConstants } from './constants/scheduleConstants';

export class Configuration {
  sourceDynamoDbTableName: string;
  deploymentAlias: string;
  failureNotificationEmail: string;
  successNotificationEmail: string;
  dataExportBucketName: string;
  dataExportBucketPrefix: string;
  dataExportBucketSseKmsKeyArn: string;
  incrementalExportWindowSizeInHours: number;
  waitTimeToCheckExportStatusInSeconds: number;
  exportViewType: ExportViewType;
  exportFormat: ExportFormat;
  awsApiInvocationTimeoutInSeconds: number;
  scheduleTimezone: string;

  constructor(scope: Construct) {
    this.sourceDynamoDbTableName = scope.node.tryGetContext('sourceDynamoDbTableName') as string;
    this.deploymentAlias = scope.node.tryGetContext('deploymentAlias') as string;
    this.failureNotificationEmail = scope.node.tryGetContext('failureNotificationEmail') as string;
    this.successNotificationEmail = scope.node.tryGetContext('successNotificationEmail') as string;
    this.dataExportBucketName = scope.node.tryGetContext('dataExportBucketName') as string;
    this.dataExportBucketPrefix = scope.node.tryGetContext('dataExportBucketPrefix') as string;
    this.dataExportBucketSseKmsKeyArn = scope.node.tryGetContext('dataExportBucketSseKmsKeyArn') as string;
    this.incrementalExportWindowSizeInHours = parseInt(scope.node.tryGetContext('incrementalExportWindowSizeInHours')) || 
      IncrementalExportDefaults.DEFAULT_INCREMENTAL_EXPORT_WINDOW_SIZE_IN_HOURS;
    this.waitTimeToCheckExportStatusInSeconds = parseInt(scope.node.tryGetContext('waitTimeToCheckExportStatusInSeconds')) || 
      IncrementalExportDefaults.WAIT_TIME_TO_CHECK_EXPORT_STATUS_IN_SECONDS;
    this.exportFormat = scope.node.tryGetContext('exportFormat') as ExportFormat || 
      ExportFormat.DYNAMODB_JSON;
    this.exportViewType = scope.node.tryGetContext('exportViewType') as ExportViewType || 
      ExportViewType.NEW_AND_OLD_IMAGES;

    this.awsApiInvocationTimeoutInSeconds = parseInt(scope.node.tryGetContext('awsApiInvocationTimeoutInSeconds')) || 
      IncrementalExportDefaults.AWS_API_INVOCATION_TIMEOUT_IN_SECONDS;

    this.scheduleTimezone = scope.node.tryGetContext('scheduleTimezone') as string ||
      ScheduleConstants.DEFAULT_SCHEDULE_TIMEZONE;
  }
}
