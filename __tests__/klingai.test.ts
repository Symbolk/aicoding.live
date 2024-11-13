import { describe, expect, test, jest } from '@jest/globals'
import handler from '../lib/klingai'
import { NextApiRequest, NextApiResponse } from 'next'

// 模拟 NextApiRequest 和 NextApiResponse
const mockReq = (method: string, body?: any, query?: any) => {
  return {
    method,
    body,
    query: query || {}
  } as NextApiRequest
}

const mockRes = () => {
  const res: Partial<NextApiResponse> = {
    status: jest.fn().mockReturnThis() as unknown as (statusCode: number) => NextApiResponse,
    json: jest.fn().mockReturnThis()
  }
  return res as NextApiResponse
}

// 修改 fetch mock 的类型定义
const mockFetch = jest.fn() as jest.MockedFunction<typeof global.fetch>
global.fetch = mockFetch

describe('KlingAI API Tests', () => {
  beforeEach(() => {
    // 清除所有模拟的调用记录
    jest.clearAllMocks()
  })

  test('提交图片生成任务', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        data: {
          task_id: 'test-task-id',
          task_status: 'pending'
        }
      })
    } as Response)

    const req = mockReq('POST', {
      prompt: '一只可爱的猫咪',
      negative_prompt: '模糊的，低质量的'
    })
    const res = mockRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        task_id: 'test-task-id',
        task_status: 'pending'
      }
    })
  })

  test('查询图片生成结果 - 成功状态', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        data: {
          task_id: 'test-task-id',
          task_status: 'succeed',
          task_result: {
            images: [
              {
                url: 'https://example.com/image1.png',
                seed: 123456
              }
            ]
          }
        }
      })
    } as Response)

    const req = mockReq('GET', null, { task_id: 'test-task-id' })
    const res = mockRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        task_id: 'test-task-id',
        task_status: 'succeed',
        task_result: {
          images: [
            {
              url: expect.any(String),
              seed: expect.any(Number)
            }
          ]
        }
      }
    })
  })

  test('查询图片生成结果 - 处理中状态', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'success',
        data: {
          task_id: 'test-task-id',
          task_status: 'processing',
          task_status_msg: '图片生成中...'
        }
      })
    } as Response)

    const req = mockReq('GET', null, { task_id: 'test-task-id' })
    const res = mockRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: {
        task_id: 'test-task-id',
        task_status: 'processing',
        task_status_msg: '图片生成中...'
      }
    })
  })

  test('处理错误情况 - 缺少task_id', async () => {
    const req = mockReq('GET')
    const res = mockRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
      error: '缺少必要的task_id参数'
    })
  })

  test('处理不支持的HTTP方法', async () => {
    const req = mockReq('PUT')
    const res = mockRes()

    await handler(req, res)

    expect(res.status).toHaveBeenCalledWith(405)
    expect(res.json).toHaveBeenCalledWith({
      error: '不支持的请求方法'
    })
  })
}) 