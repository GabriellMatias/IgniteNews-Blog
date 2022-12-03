import styles from './styles.module.scss'
import {FaGithub} from 'react-icons/fa'


export function SignInButton(){
  return(
  <button type='button'
  className={styles.signinButton}>
    <FaGithub/>
    Sign in with Github</button>
  )
}