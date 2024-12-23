import * as children  from './children';
import * as reviews  from './reviews';
import * as subjects  from './subjects';
import * as tasks  from './tasks';
import * as criteria  from './criteria';
import * as achievements  from './achievements';


export default {
    handlers: {
        ...children,
        ...tasks,
        ...subjects,
        ...reviews,
        ...criteria,
        ...achievements,
    }
}