const { createLogger, transports, format } = require("winston");
const { combine, timestamp, prettyPrint, colorize, align, printf } = format;

const alignedWithColorsAndTime = combine(
  colorize(),
  timestamp(),
  align(),
  printf(info => {
    const { timestamp, level, message, ...args } = info;

    const ts = timestamp.slice(0, 19).replace("T", " ");
    return `${ts} [${level}]: ${message} ${
      Object.keys(args).length ? JSON.stringify(args, null, 2) : ""
    }`;
  })
);

const logger = createLogger({
  defaultMeta: { service: "user-service" },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({
      filename: "error.log",
      level: "error",
      format: combine(timestamp(), prettyPrint())
    }),
    new transports.File({
      filename: "combined.log",
      format: combine(timestamp(), prettyPrint())
    }),
    new transports.Console({
      format: alignedWithColorsAndTime
    })
  ],
  // Enable exception handling when you create your logger.
  exceptionHandlers: [
    new transports.File({
      filename: "exceptions.log",
      format: combine(timestamp(), prettyPrint())
    })
  ]
});

// Call exceptions.handle with a transport to handle exceptions
logger.exceptions.handle(
  new transports.File({
    filename: "exceptions.log",
    format: combine(timestamp(), prettyPrint())
  })
);

module.exports = logger;
