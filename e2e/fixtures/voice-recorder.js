// 仅用于浏览器测试：提供确定的麦克风采样，不访问真实设备。
Object.defineProperty(navigator, 'mediaDevices', {
  configurable: true,
  value: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) }
})

window.AudioContext = class {
  sampleRate = 16000
  state = 'running'
  destination = {}

  createMediaStreamSource() {
    return { connect() {}, disconnect() {} }
  }

  createScriptProcessor() {
    let onAudioProcess
    return {
      connect() {
        onAudioProcess({ inputBuffer: { getChannelData: () => new Float32Array(4096) } })
      },
      disconnect() {},
      set onaudioprocess(callback) {
        onAudioProcess = callback
      }
    }
  }

  async close() {
    this.state = 'closed'
  }
}
