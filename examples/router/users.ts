import {createRouter} from '../../dist';

const router = createRouter();

router.get('/', async (request, context) => {
  return new Response('user');
});

export const userRouter = router;