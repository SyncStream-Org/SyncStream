// All file routes

import { Types, Validation } from 'syncstream-sharedlib';
import {
  generateDefaultHeaders,
  generateRoute,
  printUnexpectedError,
} from '../utilities';
import { SuccessState } from '../types';

export function getAllRoomFiles(roomId: string): Promise<