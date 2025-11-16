// llmNode.js

import { BaseNode } from './BaseNode';
import { llmNodeConfig } from './nodeConfigs';

export const LLMNode = ({ id, data }) => {
  return <BaseNode id={id} data={data} config={llmNodeConfig} />;
};
