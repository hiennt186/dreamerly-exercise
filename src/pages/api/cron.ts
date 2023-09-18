import { collection, collectionGroup, getDocs, orderBy, query } from 'firebase/firestore'
import { NextApiRequest, NextApiResponse } from 'next/dist/shared/lib/utils'
import { Message } from 'src/@core/types/Chat'
import { db } from 'src/firebase'
import axios from 'axios'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {

    try {

      const token = 'ergCkDNsnaxemoLiruP3nc:APA91bH5VgQBKwB-znrJb6D3aACmEY0FY6-p5fjPLiJte7jGDGJuwkNx8oxS_qQoKKc_ZF4WLhWP-3omIzJ1IyO7fqwZHgwyAcJAyKo8SzJaezJ3d-MDnpJL0xHOmXmdWU_ATlPb_FsS'; // Token FCM của thiết bị
      const notification = {
        title: 'Tiêu đề thông báo',
        body: 'Nội dung thông báo',
      };
      
      axios
        .post('https://fcm.googleapis.com/v1/projects/dreamerly-exercisedreamerly-exercise/messages:send', {
          data: notification,
          to: token,
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'key=_y8Lr9kWWZU0unXerW4AUpx9dWU5U50SxQJHWt9s4Ys', // Chìa khóa dịch vụ thông báo
          }
        })
        .then((response) => {
          console.log('Gửi thông báo thành công:', response.data);
        })
        .catch((error) => {
          console.error('Lỗi khi gửi thông báo:', error);
        });


      const messages: Message[] = []

      const collectionRef = collectionGroup(db, `messages`)
      const q = query(collectionRef, orderBy('timestamp', 'desc'))
      const querySnapshot = await getDocs(q)

      querySnapshot.forEach(doc => {
        messages.push({
          id: doc.id,
          ...doc.data()
      } as Message)
      })

      res.status(200).json(messages)
    } catch (error) {
      console.log({error})
      res.status(500).json({ error: 'Authentication failed' })
    }
  } else {
    res.status(405).end()
  }
}
