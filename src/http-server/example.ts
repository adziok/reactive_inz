import { map } from '..';
import { createReactiveServer } from '.';
import { ExecutionContext } from './ExecutionContext';
import { handleGet, handlePost } from './HttpMethodsHandlers';

createReactiveServer()
    .listen(3000)
    .pipe(
        handlePost('/test', (context: ExecutionContext) => {
            return context.json({
                data: 'Hello World!',
                body: context.body,
            });
        }),
        handleGet('/test', (context: ExecutionContext) => {
            return context.json({
                data: 'Hello World! from get',
            });
        }),
        map((context: ExecutionContext) => {
            context.json({
                error: 'Not found',
            });
            context.setStatus(404);
        })
    )
    .subscribe(undefined, (err) => {
        console.log('!!!!!-----ERROR-----!!!!!');
        console.log(err);
        console.log('\n');
    });
