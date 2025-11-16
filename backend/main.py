from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any

app = FastAPI()

# CORS configuration to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request model
class PipelineData(BaseModel):
    nodes: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]

@app.get('/')
def read_root():
    return {'Ping': 'Pong'}

@app.post('/pipelines/parse')
def parse_pipeline(pipeline: PipelineData):
    """Validate pipeline and return: {num_nodes, num_edges, is_dag}"""
    nodes = pipeline.nodes
    edges = pipeline.edges

    num_nodes = len(nodes)
    num_edges = len(edges)
    is_dag = is_directed_acyclic_graph(nodes, edges)

    return {
        'num_nodes': num_nodes,
        'num_edges': num_edges,
        'is_dag': is_dag
    }

def is_directed_acyclic_graph(nodes: List[Dict], edges: List[Dict]) -> bool:
    """Check if graph is a DAG using DFS cycle detection"""
    graph = {node['id']: [] for node in nodes}

    for edge in edges:
        source = edge.get('source')
        target = edge.get('target')
        if source in graph and target in graph:
            graph[source].append(target)

    visited = set()
    rec_stack = set()

    def has_cycle(node_id: str) -> bool:
        """DFS with recursion stack to detect cycles"""
        visited.add(node_id)
        rec_stack.add(node_id)

        for neighbor in graph.get(node_id, []):
            if neighbor not in visited:
                if has_cycle(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True

        rec_stack.remove(node_id)
        return False

    for node in nodes:
        node_id = node['id']
        if node_id not in visited:
            if has_cycle(node_id):
                return False

    return True
