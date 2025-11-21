import { useState, useEffect, useCallback } from 'react'

const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await apiFunction(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [apiFunction])

  const refetch = useCallback(() => execute(), [execute])

  useEffect(() => {
    if (apiFunction) {
      execute()
    }
  }, [apiFunction, execute, ...dependencies])

  return {
    data,
    loading,
    error,
    execute,
    refetch
  }
}

export default useApi