describe('R29.Log', function() {
  describe('@size', function() {
    it('should be added to a log length', function() {
      var log = new R29.Log({
        size: 10
      });
      expect(log.length).toBe(0);
      expect(log.size).toBe(10);
      log.push(123);
      expect(log.length).toBe(1);
      expect(log.size).toBe(11);
      log.push(321, 123);
      expect(log.length).toBe(3);
      expect(log.size).toBe(13);
    })
  })

  describe('@limit', function() {
    it('should trim a log to avoid overflowing the limit', function() {
      var log = new R29.Log({
        limit: 3
      });
      log.push(1, 2);
      expect(log.length).toBe(2);
      expect(log.size).toBe(2);
      expect(log.slice()).toEqual([1, 2]);
      log.push(3);
      expect(log.length).toBe(3);
      expect(log.size).toBe(3);
      expect(log.slice()).toEqual([1, 2, 3]);
      log.push(4);
      expect(log.length).toBe(3);
      expect(log.size).toBe(4);
      expect(log.slice()).toEqual([2, 3, 4]);
      log.push(5, 6);
      expect(log.length).toBe(3);
      expect(log.size).toBe(6);
      expect(log.slice()).toEqual([4, 5, 6]);
      log.push(7, 8, 9);
      expect(log.length).toBe(3);
      expect(log.size).toBe(9);
      expect(log.slice()).toEqual([7, 8, 9]);
      log.push(10, 11, 12, 13);
      expect(log.length).toBe(3);
      expect(log.size).toBe(13);
      expect(log.slice()).toEqual([11, 12, 13]);
    })
  })

  describe('@separator', function() {
    it('should be used when serializing items in log', function() {
      var log = new R29.Log({
        separator: '~'
      });
      expect(log.toString()).toBe('');
      log.push(1);
      expect(log.toString()).toBe('1');
      log.push(2);
      expect(log.toString()).toBe('1~2');
      log.push(3, 4);
      expect(log.toString()).toBe('1~2~3~4');
      log.separator = 'x';
      expect(log.toString()).toBe('1x2x3x4');
    })

    it ('should be used when deserializing items from string', function() {
      var log = new R29.Log({
        separator: '~'
      });
      log.fromString('');
      expect(log.slice()).toEqual([]);
      log.fromString('1');
      expect(log.slice()).toEqual(['1']);
      log.fromString('2~3');
      expect(log.slice()).toEqual(['1', '2', '3']);
      log.fromString('4~5~6');
      expect(log.slice()).toEqual(['1', '2', '3', '4', '5', '6']);
    })
  })

  describe('@string', function() {
    it ('should be used to deserialized items initially', function() {
      var log = new R29.Log({
        string: '1, 2, 3'
      })
      expect(log.slice()).toEqual(['1', '2', '3'])
    })
  })

  describe('@unique', function() {
    it ('should not let duplicate items to be added', function() {
      var log = new R29.Log({
        unique: true
      })
      log.push(1, 2);
      expect(log.slice()).toEqual([ ]);
      log.push(2, 3);
      expect(log.slice()).toEqual([1, 2, 3])
      log.push(1, 2, 3);
      expect(log.slice()).toEqual([1, 2, 3]);
      log.push(3, 4, 5);
      expect(log.slice()).toEqual([1, 2, 3, 4, 5]);
    })
  })

  describe('#onPush', function() {
    it ('should be called each time item is added', function() {
      var i = 0;
      var log = new R29.Log({
        onPush: function() {
          i++;
        }
      });
      expect(i).toBe(0);
      log.push(1);
      expect(i).toBe(1);
      log.push(2);
      expect(i).toBe(2);
      log.push(2, 3);
      expect(i).toBe(4);
      log.push(4, 5, 6);
      expect(i).toBe(7);
    })
  })

  describe('#onChange', function() {
    it ('should be called once per push() call', function() {
      var i = 0;
      var log = new R29.Log({
        onChange: function() {
          i++;
        }
      });
      expect(i).toBe(0);
      log.push(1);
      expect(i).toBe(1);
      log.push(2);
      expect(i).toBe(2);
      log.push(2, 3);
      expect(i).toBe(3);
      log.push(4, 5, 6);
      expect(i).toBe(4);
    })
  })

  describe('#onCast', function() {
    it ('should be called each time item is added to mutate the added value', function() {
      var log  = new R29.Log({
        onCast: function(i) {
          return i + 1;
        }
      })
      log.push(1);
      expect(log.slice()).toEqual([2]);
      log.push(2, 3);
      expect(log.slice()).toEqual([2, 3, 4]);
      log.push(4, 5, 6);
      expect(log.slice()).toEqual([2, 3, 4, 5, 6, 7]);
    })
  })
})