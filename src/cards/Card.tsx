import React from 'react'

const cards = [
  require('./000-empty.png'),
  require('./001-santa-claus.png'),
  require('./002-christmas-tree.png'),
  require('./003-reindeer.png'),
  require('./004-mistletoe.png'),
  require('./005-wreath.png'),
  require('./006-gingerbread-man.png'),
  require('./007-candy.png'),
  require('./008-elf.png'),
  require('./009-bow.png'),
  require('./010-nutcracker.png'),
  require('./011-sleigh.png'),
  require('./012-house.png'),
  require('./013-bauble.png'),
  require('./014-gift.png'),
  require('./015-snowflake.png'),
  require('./016-cocoa.png'),
  require('./017-boy.png'),
  require('./018-girl.png'),
  require('./019-christmas-sock.png'),
  require('./020-snowman.png'),
  require('./021-candle.png')
]

export const CardGrid: React.FC = ({ children }) => {
  return <div className="cardgrid">{children}</div>
}

type VisibleCardProps = {
  cardId: number
}
export const Card: React.FC<VisibleCardProps> = ({ cardId }) => {
  return (
    <div className="card">
      <div className="cardbg">
        <img alt={`card-${cardId}`} src={cards[cardId]} draggable={false} />
      </div>
    </div>
  )
}

type CardBackProps = {
  onSelect: () => void
}

export const CardBack: React.FC<CardBackProps> = ({ onSelect }) => (
  <div className="card" onClick={onSelect}>
    <div className="cardbg">
      <img alt={`card-back`} src={cards[0]} draggable={false} />
    </div>
  </div>
)

export const NoCard = () => {
  return (
    <div className="card nocard">
      <div className="cardbg nocard">
        <img alt={`card-no-card`} src={cards[0]} draggable={false} />
      </div>
    </div>
  )
}
