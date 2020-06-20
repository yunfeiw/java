import axois from 'axios'

axois.get('/api/getname').then(res => {
    console.log(res)
})
axois.post('/api/postname', { name: 'wang' }).then(res => {
    console.log(res)
})
console.log(1)