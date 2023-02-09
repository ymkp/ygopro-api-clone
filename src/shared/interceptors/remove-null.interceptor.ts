import {
  ClassSerializerInterceptor,
  Injectable,
  PlainLiteralObject,
} from '@nestjs/common';
import { isObject } from 'class-validator';

@Injectable()
export class RemoveNullInterceptor extends ClassSerializerInterceptor {
  serialize(
    response: PlainLiteralObject | Array<PlainLiteralObject>,
  ): PlainLiteralObject | Array<PlainLiteralObject> {
    if (!isObject(response)) {
      return response;
    }

    return this.removeNull(response);
  }

  protected removeNull(obj: Object | Array<Object>): Object | Array<Object> {
    if (Array.isArray(obj)) {
      return obj.map((o: Object) => this.removeNull(o));
    } else {
      return Object.fromEntries(
        Object.entries(obj)
          .filter(([_, v]) => v != null)
          .map(([k, v]) => [k, v === Object(v) ? this.removeNull(v) : v]),
      );
    }
  }
}
