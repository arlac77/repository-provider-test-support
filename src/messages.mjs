export function createMessageDestination() {
  const messages = {};
  const messageDestination = {
    trace: (...args) => (messages.trace = [...args]),
    info: (...args) => (messages.info = [...args]),
    error: (...args) => (messages.error = [...args]),
    warn: (...args) => (messages.warn = [...args])
  };

  return { messageDestination, messages, levels: ["trace", "info", "error", "warn"]};
}
