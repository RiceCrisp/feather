import type { NextFunction, Request, Response } from 'express'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  console.error(err.stack)
  res.status(500).send({ error: err.message })
}

export function jsonResponse(req: Request, res: Response, next: NextFunction): void {
  res.setHeader('Content-Type', 'application/json')
  const oldSend = res.send
  res.send = (data) => {
    const body = JSON.stringify(data, null, 2)
    res.send = oldSend
    return res.send(body)
  }
  next()
}

export function sessionChecker(req: Request, res: Response, next: NextFunction): void {
  if (req.session.userId === undefined) {
    res.status(401).send()
    return
  }
  next()
}
