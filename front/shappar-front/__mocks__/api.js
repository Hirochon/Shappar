export default {
  get: () => {
    console.log('api get')
    return Promise.resolve({ data: 'value' })
  }
}
