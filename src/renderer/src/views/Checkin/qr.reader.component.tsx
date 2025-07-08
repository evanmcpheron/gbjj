import { useRef, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'
import jsQR from 'jsqr'

export const QrCheckIn = ({ onLookup }) => {
  const webcamRef = useRef<Webcam>(null)

  const captureAndScan = useCallback(() => {
    const webcam = webcamRef.current
    if (!webcam || !webcam.video) return

    const video = webcam.video!
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

    const code = jsQR(imageData.data, imageData.width, imageData.height)
    if (code?.data) {
      onLookup(code.data)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      captureAndScan()
    }, 500) // scan every 0.5s

    return () => clearInterval(interval)
  }, [captureAndScan])

  return (
    <Webcam
      audio={false}
      ref={webcamRef}
      screenshotFormat="image/png"
      videoConstraints={{
        facingMode: 'environment' // use rear camera on mobile
      }}
      style={{ width: '100%', maxWidth: '400px' }}
    />
  )
}
