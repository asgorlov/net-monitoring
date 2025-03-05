import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('api', {
    sendMessage: (channel: string, data: any) => {
        const validChannels: string[] = ['toMain']
        if (validChannels.includes(channel)) {
            return ipcRenderer.invoke(channel, data)
        }
    }
})
