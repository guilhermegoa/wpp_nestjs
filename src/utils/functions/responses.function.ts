import { HttpException } from '@nestjs/common'

interface BaseResponse {
  success: boolean
  data?: any
  error?: {
    code: number
    message: string
  } | null

}

function buildSuccessResponse(success: boolean, data: any): BaseResponse {
  return {
    success,
    data,
    error: null
  }
}

function buildErrorResponse(success: boolean, error?: HttpException): BaseResponse {
  return {
    success,
    data: null,
    error: {
      code: error.getStatus(),
      message: error.message
    }
  }
}

export { buildSuccessResponse, buildErrorResponse, BaseResponse }
