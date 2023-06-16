import React from 'react';
import { Flex } from '@chakra-ui/react';
import { AiOutlineClose } from 'react-icons/ai';

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Flex
      alignItems="center"
      px={2}
      py={1}
      borderRadius="lg"
      m={1}
      mb={2}
      variant="solid"
      fontSize={12}
      backgroundColor="purple"
      color="white"
      cursor="pointer"
      onClick={handleFunction}
    >
      {user.name}
      <AiOutlineClose pl={1} />
    </Flex>
  );
};

export default UserBadgeItem;
