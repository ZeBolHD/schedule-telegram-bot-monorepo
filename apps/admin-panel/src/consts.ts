export const BOT_TOKEN = process.env.BOT_TOKEN as string;
export const TELEGRAM_UPLOAD_CHATID = process.env
  .TELEGRAM_UPLOAD_CHATID as string;

export const TELEGRAM_GETFILE_URL = `https://api.telegram.org/bot${BOT_TOKEN}/getFile?file_id=`;
export const TELEGRAM_DOWNLOAD_URL = `https://api.telegram.org/file/bot${BOT_TOKEN}/`;
export const TELEGRAM_SENDDOCUMENT_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendDocument`;
export const TELEGRAM_SENDMESSAGE_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
export const TELEGRAM_SENDPHOTO_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`;
export const TELEGRAM_SENDMEDIAGROUP_URL = `https://api.telegram.org/bot${BOT_TOKEN}/sendMediaGroup`;
