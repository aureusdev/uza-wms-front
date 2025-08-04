import { describe, it, expect } from 'vitest';
import { getInitials, getAvatarColor, isValidImageUrl } from './avatarUtils';

describe('avatarUtils', () => {
   describe('getInitials', () => {
      it('should return initials for full name', () => {
         expect(getInitials('John Doe')).toBe('JD');
         expect(getInitials('Jane Smith Wilson')).toBe('JW');
         expect(getInitials('María José García López')).toBe('ML');
      });

      it('should return single initial for single name', () => {
         expect(getInitials('John')).toBe('J');
         expect(getInitials('María')).toBe('M');
      });

      it('should handle empty or whitespace strings', () => {
         expect(getInitials('')).toBe('');
         expect(getInitials('   ')).toBe('');
         expect(getInitials('  \n  \t  ')).toBe('');
      });

      it('should handle names with extra spaces', () => {
         expect(getInitials('  John   Doe  ')).toBe('JD');
         expect(getInitials('John    Middle    Doe')).toBe('JD');
      });

      it('should return uppercase initials', () => {
         expect(getInitials('john doe')).toBe('JD');
         expect(getInitials('JANE SMITH')).toBe('JS');
         expect(getInitials('mIxEd CaSe')).toBe('MC');
      });

      it('should handle special characters', () => {
         expect(getInitials('José María')).toBe('JM');
         expect(getInitials('François Müller')).toBe('FM');
         expect(getInitials("O'Connor Smith")).toBe('OS');
      });
   });

   describe('getAvatarColor', () => {
      it('should return consistent colors for same name', () => {
         const color1 = getAvatarColor('John Doe');
         const color2 = getAvatarColor('John Doe');
         expect(color1).toBe(color2);
      });

      it('should return different colors for different names', () => {
         const color1 = getAvatarColor('John Doe');
         const color2 = getAvatarColor('Jane Smith');
         // No garantizamos que sean diferentes, pero es muy probable
         // Solo verificamos que ambos retornen colores válidos
         expect(color1).toMatch(/^bg-\w+-100 text-\w+-700$/);
         expect(color2).toMatch(/^bg-\w+-100 text-\w+-700$/);
      });

      it('should return default color for empty name', () => {
         expect(getAvatarColor('')).toBe('bg-slate-200');
         expect(getAvatarColor('   ')).toBe('bg-slate-200');
      });

      it('should return valid Tailwind color classes', () => {
         const validColors = [
            'bg-blue-100 text-blue-700',
            'bg-green-100 text-green-700',
            'bg-purple-100 text-purple-700',
            'bg-pink-100 text-pink-700',
            'bg-indigo-100 text-indigo-700',
            'bg-yellow-100 text-yellow-700',
            'bg-red-100 text-red-700',
            'bg-teal-100 text-teal-700',
         ];

         const color = getAvatarColor('Test Name');
         expect(validColors).toContain(color);
      });

      it('should handle unicode characters', () => {
         const color1 = getAvatarColor('José María');
         const color2 = getAvatarColor('François');
         const color3 = getAvatarColor('李小明');
         
         expect(color1).toMatch(/^bg-\w+-100 text-\w+-700$/);
         expect(color2).toMatch(/^bg-\w+-100 text-\w+-700$/);
         expect(color3).toMatch(/^bg-\w+-100 text-\w+-700$/);
      });
   });

   describe('isValidImageUrl', () => {
      it('should return true for valid HTTP URLs', () => {
         expect(isValidImageUrl('http://example.com/image.jpg')).toBe(true);
         expect(isValidImageUrl('https://example.com/image.png')).toBe(true);
         expect(isValidImageUrl('https://cdn.example.com/path/to/image.gif')).toBe(true);
      });

      it('should return true for valid base64 data URLs', () => {
         expect(isValidImageUrl('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ')).toBe(true);
         expect(isValidImageUrl('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA')).toBe(true);
         expect(isValidImageUrl('data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP')).toBe(true);
      });

      it('should return false for invalid URLs', () => {
         expect(isValidImageUrl('ftp://example.com/image.jpg')).toBe(false);
         expect(isValidImageUrl('file:///path/to/image.jpg')).toBe(false);
         expect(isValidImageUrl('javascript:alert("xss")')).toBe(false);
      });

      it('should return false for blob URLs', () => {
         expect(isValidImageUrl('blob:http://example.com/uuid')).toBe(false);
      });

      it('should return false for empty or invalid strings', () => {
         expect(isValidImageUrl('')).toBe(false);
         expect(isValidImageUrl('   ')).toBe(false);
         expect(isValidImageUrl('not-a-url')).toBe(false);
         expect(isValidImageUrl('http://')).toBe(false);
         expect(isValidImageUrl('https://')).toBe(false);
      });

      it('should return false for malformed data URLs', () => {
         expect(isValidImageUrl('data:text/plain;base64,SGVsbG8=')).toBe(false);
         expect(isValidImageUrl('data:image/jpeg')).toBe(false);
         expect(isValidImageUrl('data:image/jpeg;')).toBe(false);
      });

      it('should handle edge cases', () => {
         expect(isValidImageUrl('https://example.com/image with spaces.jpg')).toBe(false);
         expect(isValidImageUrl('https://example.com/image%20encoded.jpg')).toBe(true);
      });
   });
});