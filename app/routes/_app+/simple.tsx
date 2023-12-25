import React from 'react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '~/components/ui'
import { run } from '~/models/simple'
import { tfvis } from '~/services/tfvis'

export default function SimplePage() {
  const [result, setResult] = React.useState<number | null>(null)
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const input = Number(formData.get('input'))

    tfvis.visor().open()

    const ret = await run(input)
    setResult(ret)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Simple</CardTitle>
        <CardDescription>Simple description</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <Label>Input</Label>
          <Input name="input" type="number" defaultValue="100" />

          <div>Result: {result}</div>

          <Button type="submit">Run</Button>
        </form>
      </CardContent>
    </Card>
  )
}
