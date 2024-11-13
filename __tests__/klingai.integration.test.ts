import { describe, expect, test } from '@jest/globals'
import { submitImageGenTask, getGeneratedImage } from '../lib/klingai'

// 设置较长的超时时间，因为图片生成可能需要一段时间
jest.setTimeout(300000) // 5分钟超时

describe('KlingAI Integration Tests', () => {
  test('完整的图片生成流程', async () => {
    // 1. 提交图片生成任务
    const submitResult = await submitImageGenTask({
      prompt: '一只可爱的猫咪',
      negative_prompt: '模糊的，低质量的'
    })
    
    console.log('提交任务结果:', submitResult)
    expect(submitResult.code).toBe(0)
    expect(submitResult.message).toBe('SUCCEED')
    expect(submitResult.data.task_id).toBeDefined()

    // 2. 轮询获取结果
    let result
    let attempts = 0
    const maxAttempts = 30 // 最多尝试30次
    
    do {
      if (attempts > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000)) // 每2秒查询一次
      }
      
      result = await getGeneratedImage(submitResult.data.task_id)
      console.log(`第 ${attempts + 1} 次查询:`, {
        状态: result.data.task_status,
        任务ID: submitResult.data.task_id,
        完整响应: result
      })
      attempts++
      
    } while (
      result.data.task_status !== 'succeed' && 
      result.data.task_status !== 'failed' && 
      attempts < maxAttempts
    )

    // 3. 验证最终结果
    if (result.data.task_status === 'succeed') {
      console.log('\n生成成功！')
      console.log('图片URL列表:')
      expect(result.data.task_result).toBeDefined()
      const taskResult = result.data.task_result
      if (!taskResult) {
        throw new Error('task_result 为空')
      }
      
      expect(Array.isArray(taskResult.images)).toBe(true)
      
      taskResult.images.forEach((image: { url: string, seed?: number }, index) => {
        console.log(`图片 ${index + 1}: ${image.url}`)
        if (image.seed !== undefined) {
          console.log(`种子值: ${image.seed}`)
        }
        expect(image.url).toMatch(/^https?:\/\//)
      })
      
      console.log('\n注意：图片将在30天后被清理，请及时下载保存')
    } else if (result.data.task_status === 'failed') {
      console.error('生成失败:', result.data.task_status_msg)
      throw new Error(`图片生成失败: ${result.data.task_status_msg}`)
    } else {
      console.error('超过最大尝试次数，任务可能仍在处理中')
      throw new Error('任务超时')
    }
  })
}) 