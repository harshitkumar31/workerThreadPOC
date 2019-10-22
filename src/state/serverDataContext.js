const React = require('react');
const { useContext, useMemo } = React;

const ServerDataContext = React.createContext();

const ServerDataProvider = props => {
  const value = useMemo(() => {
    return {
      data: props.value
    };
  }, [props.value]);

  return React.createElement(
    ServerDataContext.Provider,
    {
      value: value
    },
    props.children
  );
};

const useServerData = fn => {
  const context = useContext(ServerDataContext);

  if (!context) {
    throw new Error(
      'useServerData() must be a child of <ServerDataProvider />'
    );
  }

  if (fn) {
    return fn(context.data);
  } else {
    return context.data;
  }
};

module.exports = {
  ServerDataProvider,
  useServerData
};
