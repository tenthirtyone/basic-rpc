const bunyan = require("bunyan");
const bformat = require("bunyan-format");
const formatOut = bformat({
  outputMode: "short",
});

const minLength = (minWidth: number) => {
  return (str: string): string => {
    if (str.length >= minWidth) {
      return str;
    } else {
      return str.padEnd(minWidth, " ");
    }
  };
};

const minLength16 = minLength(16);

export default function createLogger(name: string) {
  const logger = bunyan.createLogger({
    name: minLength16(name),
    level: "info",
    streams: [
      {
        type: "file",
        path: `/tmp/logger.log`,
        period: "1d",
        count: 30,
      },
      {
        stream: formatOut,
      },
    ],
  });
  return logger;
}
