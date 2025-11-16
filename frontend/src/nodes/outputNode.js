// outputNode.js

import { BaseNode } from './BaseNode';
import { outputNodeConfig } from './nodeConfigs';

export const OutputNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={outputNodeConfig} />;
};
