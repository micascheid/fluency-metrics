import React, {useState, createContext} from "react";

export const ToolContext = createContext();

export const ToolProvider = ({children}) => {

    const [mode, setMode] = useState('');
    const [speechSampleContext, setSpeechSampleContext] = useState('');
    const [audioFile, setAudioFile] = useState(null)
    const [fileChosen, setFileChosen] = useState('');
    const [audioFileName, setAudioFileName] = useState('');
    const [audioFileDuration, setAudioFileDuration] = useState(0);
    const [workspaceName, setWorkspaceName] = useState('');
    const [isGetTranscription, setIsGetTranscription] = useState(false);
    const [isCreateNewWorkspace, setIsCreateNewWorkspace] = useState(false);
    const [isUpdateWorkspace, setIsUpdateWorkspace] = useState(false);
    const [loadWorkspaceByObj, setLoadWorkspaceByObj] = useState(null);
    const [workspaceId, setWorkspaceId] = useState('None');
    const [expanded, setExpanded] = useState(true);
    const [workspaceExpanded, setWorkspaceExpanded] = useState(false);
    const [loadingTranscription, setLoadingTranscription] = useState(false);

    return (
        <ToolContext.Provider value={{
            mode, setMode,
            speechSampleContext, setSpeechSampleContext,
            audioFile, setAudioFile,
            fileChosen, setFileChosen,
            audioFileName, setAudioFileName,
            workspaceName, setWorkspaceName,
            workspaceId, setWorkspaceId,
            audioFileDuration, setAudioFileDuration,
            isGetTranscription, setIsGetTranscription,
            isCreateNewWorkspace, setIsCreateNewWorkspace,
            isUpdateWorkspace, setIsUpdateWorkspace,
            loadWorkspaceByObj, setLoadWorkspaceByObj,
            expanded, setExpanded,
            workspaceExpanded, setWorkspaceExpanded,
            loadingTranscription, setLoadingTranscription
        }}>
            {children}
        </ToolContext.Provider>
    )
}