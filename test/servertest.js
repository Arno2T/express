import should from 'should'

function add(a,b){
    return a+b
}

function concat(a,b){
    return add(a,b)
}


describe('Mon premier groupe de test est', ()=>{
    describe('Test add with nubmers', ()=>{

        it('should be successful', ()=>{
            should.equal(add(2,2), 4)
        })
    })
    describe('Test add with strings', ()=>{
        it('should concat two strings',()=>{
            should.equal(add('a','b'), 'ab')
        })
    })
})