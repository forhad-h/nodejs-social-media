obj = {
  test: 'test',
  for: 'for'
}
if (obj.hasOwnProperty('testt')) {
  console.log('works')
} else {
  console.log('failed')
}