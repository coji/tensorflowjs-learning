import { json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import React from 'react'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  HStack,
  Spacer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui'
import { createAndTrainModel, getData, runTest } from '~/models/car_mpg'
import { tfvis } from '~/services/tfvis'

export const loader = async () => {
  const data = await getData()
  return json({ data: data.slice(0, 50) })
}

export default function MpgModelPage() {
  const { data } = useLoaderData<typeof loader>()
  const [isPrepared, setIsPrepared] = React.useState(false)

  const handleClickRun = async () => {
    tfvis.visor().open()
    await runTest()
  }

  const handleClickCreateAndTrain = async () => {
    tfvis.visor().open()
    await createAndTrainModel()
    setIsPrepared(true)
  }

  return (
    <Card>
      <CardHeader>
        <HStack>
          <div>
            <CardTitle>Data</CardTitle>
            <CardDescription>Horse Power prediction</CardDescription>
          </div>
          <Spacer />
          <div>
            {isPrepared ? (
              <Button type="button" onClick={() => handleClickRun()}>
                Run
              </Button>
            ) : (
              <Button type="button" onClick={() => handleClickCreateAndTrain()}>
                Create and train model
              </Button>
            )}
          </div>
        </HStack>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Horse Power</TableHead>
              <TableHead>Mile Per Garon (MPG)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={`${index}`}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.horsepower}</TableCell>
                <TableCell>{row.mpg}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
