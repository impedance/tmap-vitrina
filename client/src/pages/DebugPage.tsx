import React, { useEffect, useState } from 'react';
import {
    miniApp,
    viewport,
    themeParams,
    isTMA
} from '@telegram-apps/sdk-react';

const DebugPage: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [sdkState, setSdkState] = useState<any>({});

    const addLog = (msg: string) => {
        console.log(`[DebugPage] ${msg}`);
        setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${msg}`]);
    };

    useEffect(() => {
        addLog('Debug Page Mounted');
        addLog(`isTMA: ${isTMA()}`);

        const updateState = () => {
            setSdkState({
                miniApp: {
                    isMounted: miniApp.isMounted(),
                    state: miniApp.state(),
                },
                viewport: {
                    isMounted: viewport.isMounted(),
                    isExpanded: viewport.isExpanded(),
                    height: viewport.height(),
                },
                theme: themeParams.state(),
            });
        };

        const interval = setInterval(updateState, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-4 space-y-4 font-mono text-xs overflow-auto pb-20">
            <h1 className="text-xl font-bold text-primary">TMA Debug Console</h1>

            <div className="bg-surface rounded-m p-3 shadow-card">
                <h2 className="font-bold mb-2 border-b border-hint/20">SDK Status</h2>
                <pre>{JSON.stringify(sdkState, null, 2)}</pre>
            </div>

            <div className="bg-surface rounded-m p-3 shadow-card">
                <h2 className="font-bold mb-2 border-b border-hint/20">Diagnostic Logs</h2>
                <div className="space-y-1">
                    {logs.map((log, i) => (
                        <div key={i} className="border-l-2 border-primary pl-2">{log}</div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <button
                    onClick={() => {
                        addLog('Manual Expand Triggered');
                        if (viewport.expand.isAvailable()) {
                            viewport.expand();
                            addLog('Expand call sent');
                        } else {
                            addLog('Expand NOT available');
                        }
                    }}
                    className="w-full bg-primary text-on-primary py-3 rounded-l font-bold"
                >
                    Viewport Expand
                </button>
            </div>

            <div className="text-hint text-[10px] text-center pt-4">
                User Agent: {navigator.userAgent}
            </div>
        </div>
    );
};

export default DebugPage;
