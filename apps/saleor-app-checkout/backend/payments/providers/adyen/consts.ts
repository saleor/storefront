import { Types } from "@adyen/api-library";

const EventCodeEnum = Types.notification.NotificationRequestItem.EventCodeEnum;

export const failedEvents = new Set([EventCodeEnum.CaptureFailed, EventCodeEnum.RefundFailed]);
