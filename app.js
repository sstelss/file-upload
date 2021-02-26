import firebase from 'firebase/app'
import 'firebase/storage'
import { upload } from './upload'
import { firebaseConfig } from './config'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
  multi: true,
  accept: ['.png', '.jpeg', '.jpg', '.gif'],
  onUpload (files, blocks) {
    files.forEach((file, index) => {
      const ref = storage.ref(`images/${file.name}`)
      const task = ref.put(file)

      task.on('state_changed', snapshot => {
        const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0)
        const block = blocks[index].querySelector('.preview-info-progress')
        block.textContent = percentage + '%'
        block.style.width = percentage + '%'
        console.log('percentage: ', percentage)
      }, error => {
        console.log('error: ', error)
      }, () => {
        task.snapshot.ref.getDownloadURL().then(url => {
          console.log('Download url: ', url)
        })
      })
    })
  }
})