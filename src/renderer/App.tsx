import React, { useState, useRef, useCallback } from 'react';
import './App.css';

interface Node {
  id: string;
  x: number;
  y: number;
  text: string;
  connections: string[];
}

interface Connection {
  from: string;
  to: string;
}

const App: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const createNode = useCallback((x: number, y: number) => {
    const newNode: Node = {
      id: Date.now().toString(),
      x,
      y,
      text: 'New Node',
      connections: []
    };
    setNodes(prev => [...prev, newNode]);
  }, []);

  const updateNodeText = useCallback((id: string, text: string) => {
    setNodes(prev => prev.map(node => 
      node.id === id ? { ...node, text } : node
    ));
  }, []);

  const deleteNode = useCallback((id: string) => {
    setNodes(prev => prev.filter(node => node.id !== id));
    setConnections(prev => prev.filter(conn => conn.from !== id && conn.to !== id));
  }, []);

  const handleCanvasClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      createNode(x, y);
    }
  }, [createNode]);

  const handleNodeMouseDown = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    const rect = e.currentTarget.getBoundingClientRect();
    const node = nodes.find(n => n.id === nodeId);
    if (node) {
      setDraggedNode(nodeId);
      setDragOffset({
        x: e.clientX - node.x,
        y: e.clientY - node.y
      });
    }
  }, [nodes]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedNode) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      setNodes(prev => prev.map(node =>
        node.id === draggedNode ? { ...node, x: newX, y: newY } : node
      ));
    }
  }, [draggedNode, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
  }, []);

  const startConnection = useCallback((nodeId: string) => {
    setIsConnecting(true);
    setConnectingFrom(nodeId);
  }, []);

  const finishConnection = useCallback((nodeId: string) => {
    if (isConnecting && connectingFrom && connectingFrom !== nodeId) {
      const newConnection: Connection = {
        from: connectingFrom,
        to: nodeId
      };
      setConnections(prev => [...prev, newConnection]);
    }
    setIsConnecting(false);
    setConnectingFrom(null);
  }, [isConnecting, connectingFrom]);

  return (
    <div className="app">
      <div className="toolbar">
        <h1>Mind Map Desktop App</h1>
        <div className="instructions">
          <p>クリックして新しいノードを作成 | ノードをドラッグして移動 | 右クリックで接続</p>
        </div>
      </div>
      <div 
        className="canvas"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        <svg ref={svgRef} className="connections-svg">
          {connections.map((conn, index) => {
            const fromNode = nodes.find(n => n.id === conn.from);
            const toNode = nodes.find(n => n.id === conn.to);
            if (!fromNode || !toNode) return null;
            
            return (
              <line
                key={index}
                x1={fromNode.x + 75}
                y1={fromNode.y + 25}
                x2={toNode.x + 75}
                y2={toNode.y + 25}
                stroke="#666"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {nodes.map(node => (
          <div
            key={node.id}
            className={`node ${selectedNode === node.id ? 'selected' : ''}`}
            style={{ left: node.x, top: node.y }}
            onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
            onContextMenu={(e) => {
              e.preventDefault();
              if (isConnecting) {
                finishConnection(node.id);
              } else {
                startConnection(node.id);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedNode(node.id);
            }}
          >
            <input
              type="text"
              value={node.text}
              onChange={(e) => updateNodeText(node.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Delete' && e.ctrlKey) {
                  deleteNode(node.id);
                }
              }}
            />
            <button 
              className="delete-btn"
              onClick={(e) => {
                e.stopPropagation();
                deleteNode(node.id);
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
