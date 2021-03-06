import injectStyle from '../inject-style';
import injectStylePrefixed from '../inject-style-prefixed';
import test from 'tape';

test('test injection', t => {
  const decls = [];
  const spy = {
    injectRawDeclaration: decl => {
      decls.push(decl);
      return decls.length;
    },
  };
  const classString = injectStyle(spy, {
    color: 'red',
    backgroundColor: 'blue',
    '@media (max-width: 500px)': {
      color: 'purple',
    },
    ':hover': {
      background: 'orange',
    },
  });
  t.equal(classString, '1 2 3 4');
  t.deepEqual(decls, [
    {block: 'color:red', media: void 0, pseudo: void 0},
    {
      block: 'background-color:blue',
      media: void 0,
      pseudo: void 0,
    },
    {
      block: 'color:purple',
      media: '(max-width: 500px)',
      pseudo: void 0,
    },
    {block: 'background:orange', media: void 0, pseudo: ':hover'},
  ]);
  t.end();
});

test('test injection array', function(t) {
  const decls = [];
  const spy = {
    injectRawDeclaration: function(decl) {
      decls.push(decl);
      return decls.length;
    },
  };
  const classString = injectStyle(spy, {
    color: ['red', 'blue'],
    '@media (max-width: 500px)': {
      color: ['purple', 'orange'],
    },
    ':hover': {
      color: ['green', 'yellow'],
    },
  });
  t.equal(classString, '1 2 3');
  t.deepEqual(decls, [
    {block: 'color:red;color:blue', media: void 0, pseudo: void 0},
    {
      block: 'color:purple;color:orange',
      media: '(max-width: 500px)',
      pseudo: void 0,
    },
    {block: 'color:green;color:yellow', media: void 0, pseudo: ':hover'},
  ]);
  t.end();
});

test('test injection prefixed', function(t) {
  const decls = [];
  const spy = {
    injectRawDeclaration: function(decl) {
      decls.push(decl);
      return decls.length;
    },
  };
  const classString = injectStylePrefixed(spy, {
    display: 'flex',
    height: ['min-content', '100%'],
    transition: 'height 1s',
    ':hover': {
      backgroundColor: 'linear-gradient(to bottom, red, green)',
    },
    '@media (max-width: 500px)': {
      flexGrow: 1,
    },
  });
  t.equal(classString, '1 2 3 4 5');
  t.deepEqual(decls, [
    {
      block:
        'display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex',
      media: void 0,
      pseudo: void 0,
    },
    {
      block:
        'height:-webkit-min-content;height:-moz-min-content;height:min-content;height:100%',
      media: void 0,
      pseudo: void 0,
    },
    {
      block:
        'transition:height 1s;-webkit-transition:height 1s;-moz-transition:height 1s',
      media: void 0,
      pseudo: void 0,
    },
    {
      block:
        'background-color:-webkit-linear-gradient(to bottom, red, green);background-color:-moz-linear-gradient(to bottom, red, green);background-color:linear-gradient(to bottom, red, green)',
      media: void 0,
      pseudo: ':hover',
    },
    {
      block: '-webkit-flex-grow:1;flex-grow:1',
      media: '(max-width: 500px)',
      pseudo: void 0,
    },
  ]);
  t.end();
});

test('test prefixed cache', function(t) {
  const decls = [];
  const spy = {
    injectRawDeclaration: function(decl) {
      decls.push(decl);
      return decls.length;
    },
  };
  const cache = {flexGrow: {1: 'color:red'}};
  injectStylePrefixed(
    spy,
    {
      display: 'flex',
      flexGrow: 1,
    },
    void 0,
    void 0,
    cache
  );
  t.deepEqual(cache, {
    display: {
      flex:
        'display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex',
    },
    flexGrow: {1: 'color:red'},
  });
  t.deepEqual(decls, [
    {
      block:
        'display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex',
      media: void 0,
      pseudo: void 0,
    },
    {block: 'color:red', media: void 0, pseudo: void 0},
  ]);
  t.end();
});
