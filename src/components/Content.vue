<template>
    <div class="tip">个人兴趣，仅供参考</div>
    <!-- 图片展示区域 -->
    <div class="image-display" id="image-display">
        <div class="card">
            <img src="../assets/images/effect/sectore-wave.PNG" />
            <div class="content">
                <h2 class="title">扇形波纹</h2>
                <p class="copy">随着实体运行，实时变化朝向波纹效果</p>
                <router-link to="globe">
                    <button class="btn">进入</button>
                </router-link>
            </div>
        </div>
    </div>
</template>
<script setup>
// 图片瀑布流

</script>
<style lang="scss" scoped>
$duration: .7s;
$function: cubic-bezier(0.19, 1, 0.22, 1);
.tip {
    width: 100%;
    height: 60px;
    line-height: 60px;
    color: var(--default-color);
    background-color: var(--sidebar-menu-hover-color);
    text-align: center;
    font-size: 1.2rem;
}

.image-display {
    display: grid;
    grid-gap: 1rem;
    padding: 1rem;
    max-width: 100%;
    margin: 0 auto;
    grid-template-columns: repeat(4, 2fr);

    .card {
        width: 320px;
        position: relative;
        display: flex;
        align-items: flex-end;
        text-align: center;
        overflow: hidden;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1), 0 2px 2px rgba(0, 0, 0, 0.1), 0 4px 4px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1), 0 16px 16px rgba(0, 0, 0, 0.1);

        &::after {
            content: "";
            display: block;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 200%;
            background-size: cover;
            background-position: 0 0;
            background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.009) 11.7%, rgba(0, 0, 0, 0.034) 22.1%, rgba(0, 0, 0, 0.072) 31.2%, rgba(0, 0, 0, 0.123) 39.4%, rgba(0, 0, 0, 0.182) 46.6%, rgba(0, 0, 0, 0.249) 53.1%, rgba(0, 0, 0, 0.32) 58.9%, rgba(0, 0, 0, 0.394) 64.3%, rgba(0, 0, 0, 0.468) 69.3%, rgba(0, 0, 0, 0.54) 74.1%, rgba(0, 0, 0, 0.607) 78.8%, rgba(0, 0, 0, 0.668) 83.6%, rgba(0, 0, 0, 0.721) 88.7%, rgba(0, 0, 0, 0.762) 94.1%, rgba(0, 0, 0, 0.79) 100%);
            transform: translateY(0);
            transition: all $duration $function;
        }

        &:hover,
        &:focus-within {
            align-items: center;
        }

        &:hover:before,
        &:focus-within:before {
            transform: translateY(-4%);
           transition: all $duration $function;
        }

        &:hover:after,
        &:focus-within:after {
            transform: translateY(-50%);
           transition: all $duration $function;
        }

        img {
            width: 100%;
            background-size: 100% 100%;
        }

        &:hover .content,
        &:focus-within .content {
            transform: translateY(0);
        }

        &:hover .content>*:not(.title),
        &:focus-within .content>*:not(.title) {
            opacity: 1;
            transform: translateY(0%);
            transition: all $duration $function;
        }

        &:focus-within:before,
        &:focus-within:after,
        &:focus-within .content,
        &:focus-within .content>*:not(.title) {
            transition-duration: 0s;
        }

        .content {
            position: absolute;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
            z-index: 1;
            color: white;
            transform: translateY(calc(100% - 4rem));
            transition: all $duration $function;

            >*:not(.title) {
                opacity: 0;
                transform: translateY(1rem);
                transition: all $duration $function;
            }

            .title {
                font-size: 1.3rem;
                font-weight: bold;
                line-height: 50px;
                margin-bottom: 20px;
            }

            .copy {
                font-family: var(--font-serif);
                font-size: 1.125rem;
                font-style: italic;
                line-height: 1.35;
            }

            .btn {
                cursor: pointer;
                margin-top: 1.5rem;
                padding: 0.75rem 1.5rem;
                font-size: 0.65rem;
                font-weight: bold;
                letter-spacing: 0.025rem;
                text-transform: uppercase;
                color: var(--default-color);
                background-color: var(--default-bgcolor);
                border: none;

                &:hover {
                    background-color: var(--sidebar-men-active-bgColor);
                    transition: all .7s cubic-bezier(0.075, 0.82, 0.165, 1);
                }

                &:focus {
                    outline: 1px dashed var(--sidebar-men-active-fontColor);
                    outline-offset: 3px;
                }
                
            }
        }
    }



}
</style>
