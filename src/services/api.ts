import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://ig-news-aplication-rust.vercel.app',
})
