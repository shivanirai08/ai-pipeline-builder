// inputNode.js

import { BaseNode } from './BaseNode';
import { inputNodeConfig } from './nodeConfigs';

export const InputNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={inputNodeConfig} />;
};
