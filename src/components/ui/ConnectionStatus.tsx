'use client'

import { useEffect, useState } from 'react'
import { getConnectionStatus } from '@/lib/supabase/client'

export const ConnectionStatus = () => {
  const [status, setStatus] = useState<{
    isConnected: boolean
    error?: string
    lastChecked?: Date
  }>({ 
    isConnected: false,
    lastChecked: undefined
  })

  useEffect(() => {
    setStatus(prev => ({
      ...prev,
      lastChecked: new Date()
    }))
  }, [])

  useEffect(() => {
    const checkConnection = async () => {
      const result = await getConnectionStatus()
      setStatus({
        ...result,
        lastChecked: new Date()
      })
    }

    // Check immediately
    checkConnection()

    // Then check every 30 seconds
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  if (!status.lastChecked) {
    return null
  }

  if (!status.error && status.isConnected) {
    const isRecent = (new Date().getTime() - status.lastChecked.getTime()) < 3000

    return (
      <div 
        className={`fixed bottom-4 right-4 p-4 bg-green-500 text-white rounded-lg shadow-lg transition-opacity duration-500 ${isRecent ? 'opacity-100' : 'opacity-0'}`}
      >
        <p className="font-medium">Database Connected</p>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-red-500 text-white rounded-lg shadow-lg">
      <p className="font-medium">Database Connection Error</p>
      {status.error && (
        <p className="text-sm mt-1">{status.error}</p>
      )}
      <p className="text-xs mt-2 opacity-75">
        Last checked: {status.lastChecked.toLocaleTimeString()}
      </p>
    </div>
  )
} 