import { useRouter } from 'vue-router';

export default function useNavigation() {
  const router = useRouter();

  function goBack() {
    window.history.length > 2 ? router.go(-1) : router.push('/');
  }

  return { router, goBack };
}
