import { HOSTS } from '@/config'
const useProxy = true
const host = useProxy ? process.env.API_SUB_PATH || '' : HOSTS[process.env.ENV]
export default host
