const Enzyme = require('enzyme');
const ReactAdapter = require('enzyme-adapter-react-16');

const adapter = new ReactAdapter();

Enzyme.configure(adapter);
