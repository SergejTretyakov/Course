import _ from 'lodash';

export const gallery = _.times(100, (i) => ({
  pinID: `${i}`,
  image: `https://i.pinimg.com/236x/97/d3/50/97d350dc92244e1de2015790ae6f99a8.jpg`,
  title: `Pin ${i}`,
  description: `Description of Pin ${i}`,
}));
