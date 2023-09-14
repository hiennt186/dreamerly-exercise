// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyD8q_73hdUytPlctrXWVrcKbbOR0RKoDm0',
  authDomain: 'dreamerly-exercise.firebaseapp.com',
  projectId: 'dreamerly-exercise',
  storageBucket: 'dreamerly-exercise.appspot.com',
  messagingSenderId: '899618146582',
  appId: '1:899618146582:web:bd5e63a3eaf82157502837'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app)
export default app
