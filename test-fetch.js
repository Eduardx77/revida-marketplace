const url = 'http://127.0.0.1:3001/products/61496e8b-e8e6-4413-a4f9-3c2c642bff54'
;(async () => {
  try {
    const res = await fetch(url)
    console.log('STATUS', res.status)
    const body = await res.text()
    console.log(body.slice(0,1200))
  } catch (err) {
    console.error('ERROR', err)
  }
})()
